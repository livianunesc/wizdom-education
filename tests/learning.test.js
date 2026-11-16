import test from 'node:test';
import assert from 'node:assert/strict';
import { registerTopic, recordAnswer, streakFor, noteActivity } from '../src/learning.js';
const card={id:'mat-proporcao-1',topicId:'mat-proporcao'};
test('studied topics unlock once without losing existing review records',()=>{
 const first=registerTopic(undefined,'mat-proporcao',new Date(2026,10,15));
 assert.equal(first.topics.length,1);
 assert.deepEqual(registerTopic(first,'mat-proporcao'),first);
 const other=registerTopic(first,'bio-celulas');
 assert.equal(other.topics.length,2); assert.equal(first.topics.length,1);
});
test('answers update accuracy and spaced due date; practice cannot farm XP in same day',()=>{
 const now=new Date(2026,10,15,12);
 const a=recordAnswer(undefined,card,true,now);
 assert.equal(a.xp,10); assert.equal(a.state.records[card.id].due,'2026-11-18');
 const b=recordAnswer(a.state,card,false,now);
 assert.equal(b.xp,0); assert.equal(b.state.records[card.id].due,'2026-11-16');
 assert.equal(b.state.answers.filter(x=>x.correct).length,1); assert.equal(b.state.answers.length,2);
 const c=recordAnswer(b.state,card,true,new Date(2026,10,16,12));
 assert.equal(c.xp,10); assert.equal(c.state.records[card.id].due,'2026-11-19');
 assert.equal(c.state.records[card.id].correct,2); assert.equal(c.state.records[card.id].wrong,1);
});
test('streak counts local activity days and full-minute focus without counting zero study',()=>{
 let stats={sessions:[],xp:0};
 for(const day of [13,14,15]) stats=noteActivity(stats,new Date(2026,10,day,12));
 stats=noteActivity(stats,new Date(2026,10,15,20));
 assert.equal(stats.activityDays.length,3); assert.equal(streakFor(stats,new Date(2026,10,15)),3);
 assert.equal(streakFor(stats,new Date(2026,10,16)),3); assert.equal(streakFor(stats,new Date(2026,10,17)),0);
 assert.equal(streakFor({sessions:[{date:new Date(2026,10,15,12).toISOString(),seconds:59}]},new Date(2026,10,15)),0);
 assert.equal(streakFor({sessions:[{date:new Date(2026,10,15,12).toISOString(),seconds:60}]},new Date(2026,10,15)),1);
});
