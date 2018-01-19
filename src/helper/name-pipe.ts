import {Pipe, PipeTransform } from "@angular/core";
import { UserServiceProvider } from "../providers/user-service/user-service";

@Pipe({
  name:'fetchname'
})
export class NamePipe implements PipeTransform{
    name$:string;
    photoUrl$:string;
    constructor(private userService: UserServiceProvider){

    }
    transform(value:string){
        debugger;
        if(!value){
            return "NA";
        }

        if(value){
            this.getName(value);
            if(this.name$)
                return this.name$;
            else
                return "NA";
        }
    }

    async getName(key:string){
        await this.userService.getUserByKey(key).subscribe(u=>{
            this.name$ = u.name;
            this.photoUrl$ = u.photoUrl;
        });
    }

}