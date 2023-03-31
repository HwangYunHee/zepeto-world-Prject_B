       import { ZepetoScriptBehaviour } from  'ZEPETO.Script'
        import { SpawnInfo , ZepetoPlayers , LocalPlayer , ZepetoCharacter } from 'ZEPETO.Character.Controller'
        import { Animator, Input, KeyCode } from 'UnityEngine';
        import { Button } from 'UnityEngine.UI';

        export  default  class  CharacterController  extends  ZepetoScriptBehaviour {
            public playStandButton: Button;
            public localPlayerAnimator: Animator;
      
            Start () {    
                this.playStandButton.onClick.AddListener(() => {
                   this.localPlayerAnimator.Play("Stand");
                });  

 //               ZepetoPlayers.instance.CreatePlayerWithZepetoId ( "" , "[ZEPETO_ID]" , new  SpawnInfo (), true );

                ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener ( () => {
			let _player : LocalPlayer = ZepetoPlayers.instance.LocalPlayer ;
			this.localPlayerAnimator = _player.zepetoPlayer.character.GetComponentInChildren<Animator>();
                });
            }
        }
        
        