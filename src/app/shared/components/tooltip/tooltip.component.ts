import { Component, Input, ElementRef, ContentChild, TemplateRef, OnInit,ViewChild, Renderer2} from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Utils } from 'app/shared/utils';

@Component({
    selector: 'tooltip',
    templateUrl: './tooltip.component.html',
    styleUrls: ['./tooltip.component.less']
})

export class TooltipComponent implements OnInit {
    @ContentChild('itemTemplate',{static:true}) itemTemplate: TemplateRef<any>;
    @ViewChild('defaultItemTemplate',{static:false}) defaultItemTemplate: TemplateRef<any>;
    
    onlyHover: boolean = false;
    @Input() propertyCalss: string = "";
    @Input() show:boolean = false;
    @Input() direction: string ="top";
    private _unregister: Function;
    @Input() set onlyOnHover(value: any) {
        this.onlyHover = !Utils.IsNullOrUndefined(value);
    }

    constructor(private _renderer: Renderer2, private _element: ElementRef) { }

    ngOnInit() {
        if (Utils.IsNullOrUndefined(this.itemTemplate))
            this.itemTemplate = this.defaultItemTemplate; 
    }
    
    toogleTooltip() {
        this._unregister && this._unregister();

        if (this.onlyHover)
            return

        if (this.show){
            this.show = false
            return
        }
         this.show = true;
         setTimeout(() => {
             this._unregister = this._renderer.listen(window, 'click', (e: MouseEvent) => {
                 if (Utils.Dom.Contains(<Element>e.target, this._element.nativeElement))
                     return; 
                this._unregister();
                this.show = false
             });
         });
     } 
}