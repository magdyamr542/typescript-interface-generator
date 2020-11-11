import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeroService } from './hero.service';
import { HeroListComponent } from './components/hero-list/hero-list.component';
import { HeroComponent } from './components/hero/hero.component';
import { ArrayOfStringsPipe } from './array-of-strings.pipe';
import { FormsModule } from '@angular/forms';
import { InterfaceGeneratorService } from './interface-generator.service';

@NgModule({
  declarations: [
    AppComponent,
    HeroListComponent,
    HeroComponent,
    ArrayOfStringsPipe,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [HeroService, InterfaceGeneratorService],
  bootstrap: [AppComponent],
})
export class AppModule {}
