import { Component, OnInit } from '@angular/core';
import { counterValue } from 'src/app/model/counter-value';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-third',
  templateUrl: './third.component.html',
  styleUrls: ['./third.component.scss']
})
export class ThirdComponent implements OnInit{

increments: counterValue[] = [];

constructor(public dataServ: DataService){

}
  ngOnInit(): void {

    this.dataServ.counterValuesSubject.subscribe(counterValues => {
      this.increments = []
      for (let i = 0; i < counterValues.length; i++) {
        const counterValue = counterValues[i];
        if (counterValue.type === 'increment' || counterValue.type === 'start') {
          this.increments.push(counterValue);
        }
      }
    })


  }

}
