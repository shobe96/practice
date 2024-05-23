import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTableHover]'
})
export class TableHoverDirective {

  private colors: any = {
    backgroundColor: "white",
    color: "black"
  }

  constructor(private element: ElementRef) { }

  private highlight(colors: any) {
    this.element.nativeElement.style.backgroundColor = colors.backgroundColor;
    this.element.nativeElement.style.color = colors.color;
  }

  @HostListener("mouseenter") mouseEnter() {
    this.colors.backgroundColor = "#2563EB";
    this.colors.color = "white";
    this.highlight(this.colors)
  }
  @HostListener("mouseleave") mouseLeaver() {
    this.colors.backgroundColor = "white";
    this.colors.color = "black";
    this.highlight(this.colors);
  }

}
