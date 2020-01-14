import { Component, OnInit, ViewEncapsulation } from '@angular/core';
@Component({
  template: `
    <div class="error-page page-not-found">
      <div class="message-container">
      <span class="error-img"></span> 
      <p class="message-text">
        Cтраница, которую вы искали, не существует <br/> или доступ к ней закрыт
      </p>
      </div>
    </div>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class PageNotFoundComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }

}
