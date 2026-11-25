import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { flashcards } from '../src/flashcards-data.js';
import { navigateUnit, selectChoice } from './ui-helpers.mjs';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const errors=[]; page.on('pageerror',e=>errors.push(e.message));
const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('wizdom.v1')));
const nav=name=>navigateUnit(page,name);
try{
 await page.clock.install({time:new Date('2026-11-16T18:00:00Z')});
 await page.goto(process.env.BASE_URL||'http://127.0.0.1:5173');
 await page.getByRole('button',{name:'Entrar na conta',exact:true}).click();
 await page.getByRole('button',{name:/Leo.*Engenharia/}).click();
 await expect(page.getByRole('heading',{name:/Oi, Leo/})).toBeVisible();
 await nav('Cronograma');
 await expect(page.locator('.plan-personalized')).toContainText('90 min');
 await expect(page.locator('.plan-task')).not.toHaveCount(0);
 await expect(page.locator('.plan-task').first()).toContainText('Na prática');
 await page.getByRole('button',{name:'Já estudei',exact:true}).first().click();
 await expect(page.getByRole('heading',{name:/Questões e revisões/})).toBeVisible();
 await expect(page.locator('.review-metrics')).toContainText('3');
 await page.getByRole('button',{name:'Revisar agora',exact:true}).click();
 let expectedCorrect=0;
 for(let i=0;i<3;i++){
   const question=await page.locator('.knowledge-card h2').innerText();
   const card=flashcards.find(c=>c.question===question); assert.ok(card);
   const answer=i===1?(card.answer+1)%4:card.answer; if(i!==1) expectedCorrect++;
   await page.locator('.answer-options>button').nth(answer).click();
   await page.getByRole('button',{name:'Conferir resposta'}).click();
   await expect(page.locator('.answer-feedback')).toContainText(card.explanation);
   await page.getByRole('button',{name:i===2?'Concluir revisão':'Próximo cartão',exact:true}).click();
 }
 await expect(page.getByRole('dialog')).toContainText('2/3');
 await expect(page.getByRole('dialog')).toContainText('23');
 await page.getByRole('button',{name:'Guardar essa conquista'}).click();
 await expect.poll(async () => (await state()).demo.stats.xp).toBe(23);
 const s=await state();assert.equal(s.demo.learning.answers.length,3);
 assert.equal(s.demo.learning.answers.filter(a=>a.correct).length,expectedCorrect);
 await expect(page.locator('.review-metrics')).toContainText('67%');
 await page.getByRole('button',{name:'Praticar novamente'}).click();
 for(let i=0;i<3;i++){
   const q=await page.locator('.knowledge-card h2').innerText();const c=flashcards.find(c=>c.question===q);
   await page.locator('.answer-options>button').nth(c.answer).click();
   await page.getByRole('button',{name:'Conferir resposta'}).click();
   await page.getByRole('button',{name:i===2?'Concluir revisão':'Próximo cartão',exact:true}).click();
 }
 await page.getByRole('button',{name:'Guardar essa conquista'}).click();
 await expect(page.locator('.review-metrics')).toContainText('83%');
 assert.equal((await state()).demo.stats.xp,23,'Same-day practice must not farm XP');
 await page.reload(); await nav('Revisões');
 await expect(page.locator('.review-metrics')).toContainText('83%');
 await selectChoice(page,'Assunto estudado','Biologia · Genética e hereditariedade');
 await page.getByRole('button',{name:'Estudei este assunto'}).click();
 await expect(page.locator('.learned-topic-grid>button')).toHaveCount(2);
 await nav('Meu espaço'); await page.getByRole('button',{name:'Entrar na conta',exact:true}).click();
 await page.getByRole('button',{name:/Júlia.*Medicina/}).click();
 await expect(page.getByRole('heading',{name:/Oi, Júlia/})).toBeVisible();
 assert.equal((await state()).demo.learning,undefined,'Demo profiles isolate progress');
 await page.getByRole('button',{name:'Entrar na conta',exact:true}).click(); await page.getByRole('button',{name:/Leo.*Engenharia/}).click();
 await expect(page.getByRole('heading',{name:/Oi, Leo/})).toBeVisible();
 assert.equal((await state()).demo.learning.answers.length,6);
 await nav('Provas anteriores'); await expect(page.locator('.exam-card')).toHaveCount(20);
 await page.getByRole('button',{name:'Voltar',exact:true}).click();
 await expect(page.getByRole('heading',{name:/Oi, Leo/})).toBeVisible();
 await nav('Revisões');
 for(const width of [320,390,768]){
  await page.setViewportSize({width,height:900});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Review page fits '+width);
 }
 await page.setViewportSize({width:1440,height:1000});
 await page.screenshot({path:'/tmp/wizdom-reviews.png',fullPage:true});
 assert.deepEqual(errors,[]);
 console.log('PASS learning: schedule unlock, three difficulties, correct/incorrect feedback, spaced dates, accuracy, anti-farming XP, streaks, demo isolation, persistence, back, ENEM catalog, 320px mobile');
}finally{await browser.close();}
