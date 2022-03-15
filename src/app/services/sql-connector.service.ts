import {Injectable} from '@angular/core';
import {Platform} from '@ionic/angular';
import {SQLite, SQLiteObject} from '@awesome-cordova-plugins/sqlite/ngx';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {
  createForm,
  createFormAnswers,
  createTables,
  createTags,
  createUserTags
} from '../../assets/createTableVariables';

@Injectable({
  providedIn: 'root'
})
export class SqlConnectorService {
  databaseObj: SQLiteObject;
  tableForm = "form";
  readonly tableName: string = 'tags';
  private databaseReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private plt: Platform, private sqlite: SQLite, private http: HttpClient) {
    this.createDatabase();
  }

  async createDatabase() {
    await this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'calendar_mood.db',
        location: 'default'
      })
        .then(async (db: SQLiteObject) => {
          this.databaseObj = db;
          console.log("database created")
          await this.createTable();
        }).catch((e) => {
        console.log("ERROR CREATING DATABASE");
      });
    });
  }

  async createTable() {
    await this.databaseObj.executeSql(createForm, [])
      .then(async () => {
        console.log("tables created")
        // await this.insertRow();

      }).catch((e) => {
        console.log("ERROR CREATING TABLES")
      });

    await this.databaseObj.executeSql(createFormAnswers, [])
      .catch((e) =>{
        console.log("ERROR CREATING FORM_ANSWERS TABLE")
        console.log(e)
      })

    await this.databaseObj.executeSql(createTags, [])
      .catch((e) =>{
        console.log("ERROR CREATING TAGS TABLE")
        console.log(e)
      })

    await this.databaseObj.executeSql(createUserTags, [])
      .catch((e) =>{
        console.log("ERROR CREATING USER_TAG TABLE")
        console.log(e)
    })

    console.log(await this.getAllRows(), "ALL ROWS") //ARRAY AMB L'ARRAY DE JSONS
    console.log(await this.getLastQuestions(), "LAST QUESTIONS")
    console.log(await this.getLastTags(), "LAST TAG")
  }

  async getAllRows() {
    return this.databaseObj.executeSql('SELECT * FROM form;', [])
      .then((data) => {

        let jsonResult = [] //Creació array on aniran tots els resultats amb JSON
        for (let i = 0; i < data.rows.length; i++) { //Agafem tots els resultats
          jsonResult.push(data.rows.item(i))
        }
        return jsonResult;
      }).catch((e) => {
        console.log("ERROR GETTING ALL ROWS")
        console.log(e)
        return JSON.stringify(e);
      });
  }

  async insertRow() {
    this.databaseObj.executeSql(
      'INSERT INTO \'form\'(question1, question2, question3, question4, question5) values(\'a\',\'b\',\'c\',\'d\',\'e\') '
      , [])
      .then(async () => {
        console.log("data inserted");

      }).catch((e) => {
      if (e === 6) {
        console.log("category already exists")
      } else {
        console.log("ERROR INSERTING")
        console.log(e)
      }

    });
  }

  /*insertRow(){
    this.databaseObj.executeSql(
      "INSERT INTO 'form'(question1, question2, question3, question4, question5) values(?,?,?,?,?) "
      , ['a','b','c','d','e']);
  }*/

  async getLastQuestions() {
    return this.databaseObj.executeSql(`
      SELECT *
      FROM form
      WHERE id =
            (
              SELECT MAX(id)
              FROM form
            )
      ;
    `, [])
      .then((data) => {
        const questions = [];
        if (data.rows.length > 0) {
          questions.push(data.rows.item(0));
        }
        return questions;

      }).catch((e) => {
        console.log("ERROR GETTING LAST FORM")
        console.log(e)
      });
  }

  async getLastTags() {
    this.databaseObj.executeSql(`
      SELECT *
      FROM user_tags
      WHERE id =
            (
              SELECT MAX(id)
              FROM user_tags
            )
      ;
    `, [])
      .then((data) => {
        const questions = [];
        if (data.rows.length > 0) {
          questions.push(data.rows.item(0));
        }
        return questions;

      }).catch((e) => {
      console.log("ERROR GETTING LAST TAG")
      console.log(e)
    });
  }

  getFormAnswerFromDate(date){
    //todo: hacer regex para obtener todos los registros a partir de la fecha
  }

  getFormQuestionsFromId(id){
    //todo: recibir registro de form a partir de la id
  }

  getTagQuantFromDate(date, tag){
    //todo: recibir cantidad de veces que se repite un tag a partir de una fecha
  }

  getMoodFromDate(date){
    //todo: recibir mood a partir de fechas (mes?, hace for con dias?)
  }

  async insertAnswer(answers) {
    const lastForm = await this.getLastQuestions();
    const formId = lastForm[0].id;
    const lastTag = await this.getLastTags();
    const userTagId = lastTag[0].id;

    this.databaseObj.executeSql(
      `
        INSERT INTO 'form_answers'(form_id, user_tags_id, date, percentage, answer1, answer2, answer3, answer4, answer5)
        values (formId, userTagId, answers.date, answers.mood, answers.a1, answers.a2, answers.a3, answers.a4,
                answers.a5);
      `, []);
  }

  insertTags(tags) {
    this.databaseObj.executeSql(
      `
        INSERT INTO 'user_tags'(date, tag1, tag2, tag3, tag4, tag5)
        values (tags.date, tags.t1, tags.t2, tags.t3, tags.t4, tags.t5);
      `, []);
  }

  insertQuestions(questions) {
    this.databaseObj.executeSql(
      `
        INSERT INTO 'form'(question1, question2, question3, question4, question5)
        values (questions.q1, questions.q2, questions.q3, questions.q4, questions.q5);
      `, []);
  }

  getElements() {
    const statement = `
      SELECT *
      FROM form
    `;

    return this.databaseObj.executeSql(statement);
  }
}
