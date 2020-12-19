import { Component, EventEmitter, ViewChild } from '@angular/core';
import { jsonSamples } from 'src/json';
import { MSG_TIMEOUT_MS } from './consts';
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
    // copy the json into the text area
    this.onTextCopy.subscribe((text) => this._insertTextToTextArea(text));
    // copy the interface result in the clipboard
    this.onInterfaceCopy.subscribe((interfaceResult) => {
      this._copyToClipboard(interfaceResult);
      this._showSuccessMsg('Interface Copied Successfully');
    });
  }
  title = 'angular';
  json = 'empty...';
  showErrorMsg = false;
  showSuccessMsg = false;
  successMsg = '';
  errorMsg = '';
  canCopyInterface = false;
  interface = 'empty...';
  @ViewChild('jsonInput') jsonInput;
  onTextCopy: EventEmitter<string> = new EventEmitter();
  onInterfaceCopy: EventEmitter<string> = new EventEmitter();

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
      this._showSuccessMsg('Interface was generated successfully');
      this.canCopyInterface = true;
    } catch (error) {
      this._showErrorMsg('Please insert a valid Json!!');
    }
  }
  /* Inserting the copied text to the text area */
  _insertTextToTextArea(text: string) {
    const textArea = this.jsonInput.nativeElement as HTMLTextAreaElement;
    textArea.value = text;
  }
  /* Showing the error msg for 3 Seconds */
  _showErrorMsg(msg: string) {
    this.errorMsg = msg;
    this.showErrorMsg = true;
    setTimeout(() => {
      this.showErrorMsg = false;
    }, MSG_TIMEOUT_MS);
  }

  /* Showing the error msg for 3 Seconds */
  _showSuccessMsg(msg: string) {
    this.successMsg = msg;
    this.showSuccessMsg = true;
    setTimeout(() => {
      this.showSuccessMsg = false;
    }, MSG_TIMEOUT_MS);
  }

  _copyJsonToClipboard(index: number) {
    const json = jsonSamples[index];
    this._copyToClipboard(json);
    this._showSuccessMsg('Json Copied Successfully');
  }

  /* Copying the Text to the clipboard of the user */
  _copyToClipboard(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log('Async: Copying to clipboard was successful!');
        this.onTextCopy.emit(text);
      })
      .catch(() => {
        console.log('Async: Could not copy to the clipboard!');
      });
  }
}
