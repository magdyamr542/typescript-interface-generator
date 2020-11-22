import { Component, ViewChild } from '@angular/core';
import { InterfaceGeneratorService } from './interface-generator.service';
import { syntaxHighlight } from './utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private readonly interfaceGeneratorService: InterfaceGeneratorService
  ) {}
  title = 'angular';
  json = 'empty...';
  showErrorMsg = false;
  interface = 'empty...';
  @ViewChild('jsonInput') jsonInput;

  generateInterface() {
    const jsonString: string = this.jsonInput.nativeElement.value;
    let jsonParsed: object;
    try {
      jsonParsed = JSON.parse(jsonString.replace(' ', ''));
      this.json = syntaxHighlight(JSON.stringify(jsonParsed, null, 2));
      this.interface = this.interfaceGeneratorService.generateInterface(
        jsonParsed
      );
    } catch (error) {
      this._showErrorMsg();
    }
  }

  /* Showing the error msg for 3 Seconds */
  _showErrorMsg() {
    this.showErrorMsg = true;
    setTimeout(() => {
      this.showErrorMsg = false;
    }, 3000);
  }
}
