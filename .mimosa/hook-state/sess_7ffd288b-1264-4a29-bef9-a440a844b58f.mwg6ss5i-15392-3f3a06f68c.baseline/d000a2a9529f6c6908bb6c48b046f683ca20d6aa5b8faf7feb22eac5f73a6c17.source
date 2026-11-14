import assert from 'node:assert/strict';
import test from 'node:test';
import { createScheduler } from '../src/Components/swarm/scheduler.js';

function task(id, index, groupId = 'card-a', dependency = null, y = 150) {
  return { id, index, groupId, dependency, duration: 200, geometry: { x: 10, y, width: 300, height: 200 }, groupGeometry: { x: 10, y, width: 300, height: 200 } };
}
function moveGroup(scheduler, groupId, y) {
  scheduler.snapshot().tasks.filter(item => item.groupId === groupId).forEach(item => {
    item.groupGeometry = { ...item.groupGeometry, y };
    item.geometry = { ...item.geometry, y };
  });
}
function finishOwner(scheduler) {
  const id = scheduler.snapshot().owner;
  for (let frame = 0; frame < 30 && scheduler.snapshot().owner === id; frame += 1) scheduler.tick(100, 720);
}

const cards = () => [task('frame-a', 0), task('title-a', 1, 'card-a', 'frame-a'), task('icon-a', 2, 'card-a', 'frame-a'), task('body-a', 3, 'card-a', 'frame-a'), task('frame-b', 4, 'card-b'), task('title-b', 5, 'card-b', 'frame-b')];

test('only one group builds, with distinct builders collaborating inside it', () => {
  const scheduler = createScheduler(cards());
  scheduler.tick(0, 720);
  scheduler.tick(200, 720);
  const snapshot = scheduler.snapshot();
  assert.equal(snapshot.owner, 'card-a');
  assert.equal(snapshot.active.length, 3);
  assert.equal(new Set(snapshot.active.map(item => item.builder)).size, 3);
  assert.ok(snapshot.active.every(item => item.groupId === 'card-a'));
  assert.equal(snapshot.tasks.find(item => item.id === 'frame-b').state, 'pending');
});

test('surface dependencies are honored and the next card starts after completion', () => {
  const scheduler = createScheduler(cards());
  assert.deepEqual(scheduler.tick(0, 720).active.map(item => item.id), ['frame-a']);
  finishOwner(scheduler);
  assert.equal(scheduler.snapshot().groups.find(group => group.id === 'card-a').state, 'visible');
  assert.equal(scheduler.snapshot().owner, 'card-b');
});

test('off-screen work remains culled and consumes no logical animation time', () => {
  const scheduler = createScheduler([task('far-card', 0, 'far', null, 5000)]);
  scheduler.tick(5000, 720);
  assert.equal(scheduler.snapshot().clock, 0);
  assert.equal(scheduler.snapshot().working, false);
  assert.equal(scheduler.snapshot().tasks[0].state, 'culled');
});

test('outgoing edge triggers erasure, hard exit cancels it, return rebuilds', () => {
  const scheduler = createScheduler([task('frame-a', 0), task('title-a', 1, 'card-a', 'frame-a')]);
  scheduler.tick(0, 720); finishOwner(scheduler);
  moveGroup(scheduler, 'card-a', -80);
  scheduler.updateViewport(720, { top: 64, direction: 1 });
  assert.equal(scheduler.snapshot().operation, 'erase');
  scheduler.tick(100, 720);
  assert.ok(scheduler.snapshot().tasks[0].progress < 1);
  assert.equal(scheduler.snapshot().active[0].state, 'erasing');
  moveGroup(scheduler, 'card-a', -500);
  scheduler.updateViewport(720);
  assert.equal(scheduler.snapshot().owner, null);
  assert.ok(scheduler.snapshot().tasks.every(item => item.state === 'culled' && item.progress === 0 && item.builder === null));
  moveGroup(scheduler, 'card-a', 150);
  assert.equal(scheduler.updateViewport(720, { direction: -1 }).owner, 'card-a');
  assert.equal(scheduler.tick(0, 720).active[0].state, 'running');
});

test('completed edge erasure does not repeatedly rebuild until returning inward', () => {
  const scheduler = createScheduler([task('frame-a', 0)]);
  scheduler.tick(0, 720); finishOwner(scheduler);
  moveGroup(scheduler, 'card-a', -80);
  scheduler.tick(240, 720);
  assert.equal(scheduler.snapshot().groups[0].state, 'culled');
  assert.equal(scheduler.updateViewport(720).owner, null);
  moveGroup(scheduler, 'card-a', 150);
  assert.equal(scheduler.updateViewport(720).owner, 'card-a');
});

test('reverse scrolling selects bottom group first and cancels reverse erasure', () => {
  const scheduler = createScheduler([task('top', 0, 'top', null, 180), task('bottom', 1, 'bottom', null, 400)]);
  assert.equal(scheduler.updateViewport(720, { direction: -1 }).owner, 'bottom');
  scheduler.tick(0, 720); finishOwner(scheduler);
  moveGroup(scheduler, 'bottom', 630);
  scheduler.updateViewport(720, { direction: -1 });
  assert.equal(scheduler.snapshot().operation, 'erase');
  scheduler.tick(100, 720);
  moveGroup(scheduler, 'bottom', 400);
  scheduler.updateViewport(720, { direction: 1 });
  assert.ok(scheduler.snapshot().groups.find(group => group.id === 'bottom').state !== 'erasing');
  assert.ok(scheduler.snapshot().active.every(item => item.state !== 'erasing'));
});

test('pause freezes time and focused groups remain visible off-screen', () => {
  const scheduler = createScheduler([task('frame-a', 0)]);
  scheduler.tick(0, 720); scheduler.tick(50, 720);
  const before = scheduler.snapshot().clock;
  scheduler.tick(10000, 720, 3, true);
  assert.equal(scheduler.snapshot().clock, before);
  moveGroup(scheduler, 'card-a', -500);
  scheduler.updateViewport(720, { pinned: new Set(['card-a']) });
  assert.equal(scheduler.snapshot().groups[0].state, 'visible');
  scheduler.updateViewport(720, { pinned: new Set() });
  assert.equal(scheduler.snapshot().groups[0].state, 'culled');
});

test('automatic idle remains reversible while Go Live survives reconciliation until Replay', () => {
  const scheduler = createScheduler([task('frame-a', 0)]);
  scheduler.tick(0, 720); finishOwner(scheduler);
  assert.equal(scheduler.snapshot().idle, true);
  assert.equal(scheduler.snapshot().completed, false);
  scheduler.complete();
  scheduler.reconcile([task('frame-a', 0, 'card-a', null, -1000), task('new', 1, 'new', null, 5000)]);
  scheduler.updateViewport(720);
  assert.equal(scheduler.snapshot().completed, true);
  assert.ok(scheduler.snapshot().tasks.every(item => item.state === 'done'));
  scheduler.reset();
  assert.equal(scheduler.snapshot().completed, false);
  assert.ok(scheduler.snapshot().tasks.every(item => item.state === 'culled'));
});

test('reconciliation reassigns active builders and removes deleted group safely', () => {
  const scheduler = createScheduler(cards());
  scheduler.tick(0, 720); scheduler.tick(50, 720);
  scheduler.reconcile(cards());
  scheduler.tick(0, 720);
  assert.ok(scheduler.snapshot().active.every(item => item.builder !== null));
  scheduler.reconcile(cards().filter(item => item.groupId === 'card-b'));
  assert.equal(scheduler.updateViewport(720).owner, 'card-b');
});

test('structural surface readiness follows visible descendants without building sibling cards', () => {
  const structural = { ...task('section', 0, 'section', null, 0), structural: true };
  const scheduler = createScheduler([structural, task('frame-a', 1, 'card-a', 'section'), task('frame-b', 2, 'card-b', 'section', 5000)]);
  scheduler.tick(0, 720);
  assert.equal(scheduler.snapshot().tasks[0].state, 'done');
  assert.equal(scheduler.snapshot().owner, 'card-a');
  assert.equal(scheduler.snapshot().tasks[2].state, 'culled');
  scheduler.completeIds(new Set(['frame-a']));
  assert.equal(scheduler.snapshot().groups.find(group => group.id === 'card-a').state, 'visible');
  assert.equal(scheduler.snapshot().tasks[2].state, 'culled');
});

test('entry threshold and edge hysteresis avoid repeated animations during boundary jitter', () => {
  const scheduler = createScheduler([task('short-card', 0, 'short', null, 710)]);
  assert.equal(scheduler.updateViewport(720).owner, null);
  moveGroup(scheduler, 'short', 655);
  assert.equal(scheduler.updateViewport(720).owner, 'short');
  scheduler.tick(0, 720); finishOwner(scheduler);
  moveGroup(scheduler, 'short', 645);
  assert.equal(scheduler.updateViewport(720).groups[0].state, 'visible');
  moveGroup(scheduler, 'short', 700);
  assert.equal(scheduler.updateViewport(720).groups[0].state, 'visible');
});

test('erasing an outgoing group preempts but does not duplicate another card build', () => {
  const scheduler = createScheduler(cards());
  scheduler.tick(0, 720); finishOwner(scheduler);
  scheduler.tick(0, 720); scheduler.tick(50, 720);
  assert.equal(scheduler.snapshot().owner, 'card-b');
  moveGroup(scheduler, 'card-a', -80);
  const outgoing = scheduler.tick(50, 720);
  assert.equal(outgoing.owner, 'card-a');
  assert.equal(outgoing.operation, 'erase');
  assert.ok(outgoing.active.every(item => item.groupId === 'card-a'));
  scheduler.tick(250, 720);
  assert.equal(scheduler.snapshot().owner, 'card-b');
  scheduler.tick(0, 720);
  assert.ok(scheduler.snapshot().active.every(item => item.groupId === 'card-b' && item.builder !== null));
});

test('new members join both already-visible and currently-building groups', () => {
  for (const completed of [false, true]) {
    const scheduler = createScheduler([task('old', 0)]);
    scheduler.tick(0, 720); scheduler.tick(50, 720);
    if (completed) finishOwner(scheduler);
    scheduler.reconcile([task('old', 0), task('inserted', 1), task('next-card', 2, 'next')]);
    scheduler.tick(0, 720);
    finishOwner(scheduler);
    assert.equal(scheduler.snapshot().tasks.find(item => item.id === 'inserted').state, 'done');
    assert.equal(scheduler.snapshot().owner, 'next');
  }
});

test('one-pixel edge jitter keeps erased content culled until a meaningful return', () => {
  const scheduler = createScheduler([task('frame-a', 0)]);
  scheduler.tick(0, 720); finishOwner(scheduler);
  moveGroup(scheduler, 'card-a', -16);
  scheduler.tick(240, 720);
  assert.equal(scheduler.snapshot().groups[0].state, 'culled');
  moveGroup(scheduler, 'card-a', -15);
  assert.equal(scheduler.updateViewport(720).owner, null);
  moveGroup(scheduler, 'card-a', 25);
  assert.equal(scheduler.updateViewport(720).owner, 'card-a');
});

test('Less motion immediately reveals visible groups but still culls exits', () => {
  const scheduler = createScheduler([task('frame-a', 0), task('far', 1, 'far', null, 5000)]);
  scheduler.updateViewport(720, { reduced: true });
  assert.equal(scheduler.snapshot().groups[0].state, 'visible');
  assert.equal(scheduler.snapshot().groups[1].state, 'culled');
  assert.equal(scheduler.snapshot().working, false);
});
