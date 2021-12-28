import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { InterfaceGeneratorService } from './interface-generator.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule],
  providers: [InterfaceGeneratorService],
  bootstrap: [AppComponent],
})
export class AppModule {}
