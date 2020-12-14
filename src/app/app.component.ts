import { Component, ViewChild } from '@angular/core';
import { jsonSamples } from 'src/json';
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
  ) {
  }
  title = 'angular';
  json = 'empty...';
  showErrorMsg = false;
  showCopyMsg = false;
  interface = 'empty...';
  @ViewChild('jsonInput') jsonInput;

  generateInterface() {
    const textArea = this.jsonInput.nativeElement as HTMLTextAreaElement;
    const jsonString: string = textArea.value;
    let jsonParsed: object;
    try {
      jsonParsed = JSON.parse(jsonString.replace(' ', ''));
      // show the json in the text area and the json area
      this.json = syntaxHighlight(JSON.stringify(jsonParsed, null, 2));
      textArea.value = JSON.stringify(jsonParsed, null, 2);
      // compute and show the interfaces
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



  /* Showing the error msg for 3 Seconds */
  _showCopyMsg() {
    this.showCopyMsg = true;
    setTimeout(() => {
      this.showCopyMsg = false;
    }, 3000);
  }


  _copyJsonToClipboard(index:number){
    const json = jsonSamples[index];
  navigator.clipboard.writeText(json).then(() => {
    console.log('Async: Copying to clipboard was successful!');
    this._showCopyMsg();
  }).catch(() => {
    console.log('Async: Could not copy to the clipboard!')
  })
}
  
}
