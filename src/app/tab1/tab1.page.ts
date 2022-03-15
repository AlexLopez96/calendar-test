import { Component } from '@angular/core';

interface Tag {
  name:String;
  color:String;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {

  constructor() { }

  //color per defecte del component ion-range:
  public color: string = "dark";

  public tags: Tag[] = [
    { name:"alegria", color:"primary" },
    { name:"tristessa", color:"tertiary" },
    { name:"pau", color:"light" },
    { name:"serenitat", color:"dark" },
    { name:"ira", color:"blue" },
    { name:"ràbia", color:"red" },
    { name:"inquietud", color:"blue" }
  ]

  public selectedTags:String[]=[];

  pregunta1:String="";
  pregunta2:String="";
  pregunta3:String="";

  /** Quan es fa submit del formulari s'executa aquesta funció
   *  envia al backend les dades
   */
  public saveClick(){ 
    //TODO: Enviar les dades a backend
    console.log(this.pregunta1);
    console.log(this.pregunta2);
    console.log(this.pregunta3)
    console.log(this.selectedTags)

  }

  /** Canvia el color del component ion-range segons el valor rebut
   * @param value CustomEvent
   */
  public rangeChange(value:any) {

    switch (value.detail.value) {
      case 0: this.color = "dark"
      break;
      case 1: this.color = "dark"
        break;
      case 2: this.color = "dark"
        break;
      case 3: this.color = "danger"
        break;
      case 4: this.color = "warning"
        break;
      case 5: this.color = "tertiary"
        break;
      case 6: this.color = "secondary"
        break;
      case 7: this.color = "primary"
        break;
      case 8: this.color = "success"
        break;
      case 9: this.color = "medium"
        break;
      case 10: this.color = "light"
        break;
      default:
        this.color = "dark"
    }
  }
}
