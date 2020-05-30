import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements OnInit {
  
  @Input() title: string;
  @Input() body: string;
  @Input() link: string;
  @ViewChild('truncator') truncator: ElementRef<HTMLElement>;
  @ViewChild('bodyText') bodyText: ElementRef<HTMLElement>;
  @ViewChild('container') container: ElementRef<HTMLElement>;
  @Output('delete') deleteEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(private renderer: Renderer2) { }
   ngOnInit():void{

   }
  ngAfterViewInit(): void {
    // view truncator only if there is a text overflows in the note body text
    let style= window.getComputedStyle(this.bodyText.nativeElement, null);
    let viewableHieght =parseInt(style.getPropertyValue("height"), 10);
    if(this.bodyText.nativeElement.scrollHeight>viewableHieght){
      // here no text overflow, we show the truncator
      this.renderer.setStyle(this.truncator.nativeElement,'display','block');
    }else{
      //we hide the truncator
      this.renderer.setStyle(this.truncator.nativeElement,'display','none');
    }
  }
  onXbuttonClick(){
    this.deleteEvent.emit();
  }

}
