import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {Button} from "UnityEngine.UI";
import { GameObject } from 'UnityEngine';

export default class PanelOpen extends ZepetoScriptBehaviour {

    public myButton: Button;
    public targetPanel: GameObject;
    private openState : boolean = true;

    Start() {

        //When Button Click
        this.myButton.onClick.AddListener(()=>{
            if(this.openState){
                this.targetPanel.SetActive(false);
                this.openState = false;
            }
            else{
                this.targetPanel.SetActive(true);
                this.openState = true;
            }
        });
    }
}



// 버튼 이름=my    판넬을...targetPanel 을 게임 오브젝트로..만들기