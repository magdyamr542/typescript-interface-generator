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
  interface = 'empty...';
  @ViewChild('jsonInput') jsonInput;

  generateInterface() {
    const jsonString: string = this.jsonInput.nativeElement.value;
    const jsonParsed = JSON.parse(jsonString.replace(' ', ''));
    this.json = syntaxHighlight(JSON.stringify(jsonParsed, null, 2));
    this.interface = this.interfaceGeneratorService.generateInterface(
      jsonParsed
    );
  }
}
