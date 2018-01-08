import { Directive, ElementRef, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: 'img[avatar]'
})
export class AvatarDirective implements OnDestroy {

  nativeElement: any;
  private ERROR_EVENT_TYPE: string = 'error';
  private LOAD_EVENT_TYPE: string = 'load';
  private cancelOnError: Function;
  private cancelOnLoad: Function;
  default_avatar: string = "http://www.4akb.ru/default-icon.png";

  constructor(private elementRef: ElementRef, public renderer: Renderer2) {
    this.nativeElement = this.elementRef.nativeElement;
    this.onError = this.onError.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.addEvents();
  }
  
  ngOnInit() { }
  
  ngOnDestroy() {
    this.removeOnErrorEvent();
    this.removeOnLoadEvent();
  }

  onLoad() {
    this.removeOnErrorEvent();
  }

  onError() {
    this.renderer.setAttribute(this.nativeElement, 'src', this.default_avatar);
    this.removeOnLoadEvent();
  }
  
  private removeOnErrorEvent() {
    if (this.cancelOnError) {
      this.cancelOnError();
    }
  }

  private removeOnLoadEvent() {
    if (this.cancelOnLoad) {
      this.cancelOnLoad();
    }
  }

  private addEvents() {
    this.cancelOnError = this.renderer.listen(this.nativeElement, this.ERROR_EVENT_TYPE, this.onError);
    this.cancelOnLoad = this.renderer.listen(this.nativeElement, this.LOAD_EVENT_TYPE, this.onLoad);
  }

}