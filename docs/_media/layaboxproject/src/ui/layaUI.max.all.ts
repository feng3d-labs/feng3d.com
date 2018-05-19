
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui {
    export class MainUIUI extends View {
		public leftBtn:Laya.Button;
		public rightBtn:Laya.Button;
		public upBtn:Laya.Button;
		public downBtn:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":600,"height":400},"child":[{"type":"Button","props":{"y":186,"x":28,"var":"leftBtn","skin":"comp/button.png","label":"左"}},{"type":"Button","props":{"y":188,"x":508,"var":"rightBtn","skin":"comp/button.png","label":"右"}},{"type":"Button","props":{"y":49,"x":253,"var":"upBtn","skin":"comp/button.png","label":"上"}},{"type":"Button","props":{"y":290,"x":269,"var":"downBtn","skin":"comp/button.png","label":"下"}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.MainUIUI.uiView);

        }

    }
}
