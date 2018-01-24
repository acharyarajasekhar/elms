import {Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name:'nametrim'
})
export class NametrimPipe implements PipeTransform{
    transform(value:string, limit?:number){
        if(!value){
            return null;
        }
        let actVal = value.split(' ')[0];
        if(actVal.length > limit){
            return actVal.substr(0, limit);
        }
        else{
            return actVal;
        }
    }
}