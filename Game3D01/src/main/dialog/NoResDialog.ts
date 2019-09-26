import { ui } from "../../ui/layaMaxUI";

export default class NoResDialog extends ui.test.NoResDialogUI{
    constructor(){
        super();
    }

    public setType( type:NoResDialogType ):void{
        if( type == 0 ){
            this.vs.selectedIndex = 0;
            this.l1.text = "剩余次数:0/3";
            this.title.text = "体力不足";
        }else{
            this.vs.selectedIndex = 1;
            if( type == NoResDialogType.red ){
                this.title.text = "红宝石不足";
                this.dia.vs.selectedIndex = 0;
            }else if( type == NoResDialogType.blue ){
                this.title.text = "蓝宝石不足";
                this.dia.vs.selectedIndex = 1;
            }
        }
    }
}

export enum NoResDialogType{
    tili = 0,
    red = 1,
    blue = 2
}