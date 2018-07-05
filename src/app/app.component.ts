import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import {ColorPickerService} from 'angular4-color-picker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  ngOnInit() {
  }
  index: number=0;
  notFound: boolean = false; // Если какой-то индекс пропал из-за удаления кнопки, новая получит этот индекс
  private colors: Colorpick[]=[{color:'red',isActive:false},{color:'orange',isActive:false},
  {color:'yellow',isActive:false},{color:'green',isActive:false},{color:'aquamarine',isActive:false}
  ,{color:'blue',isActive:false},{color:'purple',isActive:false},{color:'#666',isActive:false}];
  private arrbtns: IButton[]=[]; // Массив кнопок
  display: boolean = false; //Если true, модальное окно будет открываться 
  selectedButton: IButton; // Кнопка, для которой буду менять настройки  
  newDesc: string; // Возможно лишнее, запоминаю в эту переменную новое описание для кнопки
  newColor: string; // По аналогии с предыдущим
  constructor(private dragulaService: DragulaService) {    
    this.arrbtns.push({      
      color: '#666',
      idx: this.index,
      description: 'Кнопка '+(this.index+1),
      })     
      this.index++;
      dragulaService.drag.subscribe((value) => {
        this.onDrag(value.slice(1));
      });
      dragulaService.drop.subscribe((value) => {
        this.onDrop(value.slice(1));
      });
      dragulaService.over.subscribe((value) => {
        this.onOver(value.slice(1));
      });
      dragulaService.out.subscribe((value) => {
        this.onOut(value.slice(1));
      });
  }
  Arrpush(){ //Метод для создания новой кнопки
    if(this.arrbtns.length!=this.index)
    {
      for(let i=0;i<this.index;i++)
      {
        this.notFound=false;
        for(let j=0;j<this.arrbtns.length;j++)
        {
          if(i==this.arrbtns[j].idx)
          {
            this.notFound=true;
          }
        }
        if(!this.notFound)
        {
          this.arrbtns.push({
            description: 'Кнопка '+(i+1),
            color: '#666',
            idx: i,
            })
            return;
        }
      }
    }
    else{
      this.arrbtns.push({
        description: 'Кнопка '+(this.index+1),
        color: '#666',
        idx: this.index,
        })  
        this.index++; 
    }     
  }
  BtDelete(){ //Удаление выбранной кнопки
    for(let i=0;i<this.arrbtns.length;i++)
    {
      if(this.arrbtns[i]==this.selectedButton){
        this.arrbtns.splice(i,1);
        this.display=false;
      }
    }
    
  }
  showDialog(btn: IButton) { // Чтобы открылось модальное окно + запоминаю кнопку, для которой буду менять настройки
      this.display = true;
      this.selectedButton=btn;
      this.newDesc=this.selectedButton.description;
      this.newColor=this.selectedButton.color;
      for(let i=0;i<this.colors.length;i++)
    {
      if(this.selectedButton.color==this.colors[i].color)
      {
        this.colors[i].isActive=true;
      }
      else{
        this.colors[i].isActive=false;
      }
    }
  } 
  colorChange(clr: Colorpick){
    this.selectedButton.color=clr.color;
    for(let i=0;i<this.colors.length;i++)
    {
      if(this.selectedButton.color==this.colors[i].color)
      {
        this.colors[i].isActive=true;
      }
      else{
        this.colors[i].isActive=false;
      }
    }    
  }
  FalseYes(){ // Вызываестя при подтверждении смены настроек у кнопки(т.е. при клике на кнопку 'Yes' в модальном окне)
    this.selectedButton.description=this.newDesc;
    this.display=false;    
  }   
  private hasClass(el: any, name: string) {
    return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(el.className);
  }

  private addClass(el: any, name: string) {
    if (!this.hasClass(el, name)) {
      el.className = el.className ? [el.className, name].join(' ') : name;
    }
  }

  private removeClass(el: any, name: string) {
    if (this.hasClass(el, name)) {
      el.className = el.className.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
    }
  }
  private onDrag(args) {
    let [e, el] = args;
    this.removeClass(e, 'ex-moved');
  }

  private onDrop(args) {
    let [e, el] = args;
    this.addClass(e, 'ex-moved');
  }

  private onOver(args) {
    let [e, el, container] = args;
    this.addClass(el, 'ex-over');
  }

  private onOut(args) {
    let [e, el, container] = args;
    this.removeClass(el, 'ex-over');
  }
  
   
}  
interface Colorpick{ // Цветовой блок(в модальном окне)
  color: string;
  isActive: boolean;
}
interface IButton{ // Кнопка
  idx: number;
  description: string;
  color: string; 
}



