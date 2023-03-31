import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { LocalPlayer, SpawnInfo, ZepetoCharacter, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { OfficialContentType, WorldService, ZepetoWorldContent, Content, ZepetoWorldMultiplay } from 'ZEPETO.World';
import { RawImage, Text, Button } from 'UnityEngine.UI';
import { GameObject, Texture2D, Transform, WaitUntil } from 'UnityEngine';
import Thumbnail from './Thumbnail';
import { Room, RoomData } from 'ZEPETO.Multiplay';
 
interface PlayerGestureInfo {
    sessionId: string,
    gestureId: string
}
 
const CancelMotion = "" as const;
 
export default class GestureLoaderMultiPlay extends ZepetoScriptBehaviour {
 
    public multiplay: ZepetoWorldMultiplay;
     
    @HideInInspector() public contents: Content[] = [];
    @HideInInspector() public thumbnails: GameObject[] = [];
 
    @SerializeField() private _count: number = 50;
    @SerializeField() private _contentsParent: Transform;
    @SerializeField() private _prefThumb: GameObject;
 
    private _myCharacter: ZepetoCharacter;
    private _room: Room;
    private _contentsMap: Map<string, Content> = new Map<string, Content>();
 
    Start() {
        // Creating a Character
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this._myCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
            
            // In order to take a thumbnail with my character, You need to request the content after the character is created.
            this.ContentRequest();
        });
 
        // For MultiPlay
        this.multiplay.RoomCreated += (room: Room) => {
            this._room = room;
            // Receive user's gesture information from the server
            this._room.AddMessageHandler("OnChangeGesture", (message: PlayerGestureInfo) => {
                let playerGestureInfo: PlayerGestureInfo = {
                    sessionId: message.sessionId,
                    gestureId: message.gestureId
                };
                this.LoadAnimation(playerGestureInfo);
            });
        };
    }
 
 
    // 1. Receive content from the server
    private ContentRequest(){
         
        // All Type Request
        ZepetoWorldContent.RequestOfficialContentList(OfficialContentType.All, contents => {
            this.contents = contents;
            for (let i = 0; i < this._count; i++) {
                if (!this.contents[i].IsDownloadedThumbnail) {
                    // Take a thumbnail photo using my character
                    this.contents[i].DownloadThumbnail(this._myCharacter,() =>{
                        this.CreateThumbnailObjcet(this.contents[i]);
                    });
                } else {
                    this.CreateThumbnailObjcet(this.contents[i]);
                }
            }
        });
 
    }
 
    // 2. Creating Thumbnail Objects
    private CreateThumbnailObjcet(content: Content) {
        const newThumb: GameObject = GameObject.Instantiate(this._prefThumb, this._contentsParent) as GameObject;
        newThumb.GetComponent<Thumbnail>().content = content;
 
        // Create a dictionary to find content with a content Id
        this._contentsMap.set(content.Id, content);
         
        // Button Listener for each thumbnail
        newThumb.GetComponent<Button>().onClick.AddListener(() => {
            this.SendMyGesture(content.Id);
        });
 
        // thimnail list
        this.thumbnails.push(newThumb);
 
    }
 
    // For MultiPlay
    // Send clicked gesture information to the server
    public SendMyGesture(gestureId) {
        const data = new RoomData();
        data.Add("gestureId", gestureId);
        this._room.Send("OnChangeGesture", data.GetObject());
    }
 
    // 3. Loading Animation
    private LoadAnimation(playerGestureInfo: PlayerGestureInfo){
         
        if (!ZepetoPlayers.instance.HasPlayer(playerGestureInfo.sessionId)) {
            console.log("Player does not exist");
            return;
        }
         
        const zepetoPlayer = ZepetoPlayers.instance.GetPlayer(playerGestureInfo.sessionId).character;
 
        if (playerGestureInfo.gestureId == CancelMotion) {
            zepetoPlayer.CancelGesture();
            return;
        }
        else if(!this._contentsMap.has(playerGestureInfo.gestureId)) {
            console.log("Resource not yet loaded");
            return;
        }
 
        const content = this._contentsMap.get(playerGestureInfo.gestureId);
 
        // Verify animation load
        if (!content.IsDownloadedAnimation) {
            // If the animation has not been downloaded, download it.
            content.DownloadAnimation(() => {
                // play animation clip
                zepetoPlayer.SetGesture(content.AnimationClip);
            });
        } else {
            zepetoPlayer.SetGesture(content.AnimationClip);
        }
    }
}