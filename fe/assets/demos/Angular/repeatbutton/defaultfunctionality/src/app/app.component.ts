import { Component, ViewChild } from '@angular/core';


import { jqxRepeatButtonModule, jqxRepeatButtonComponent } from 'jqwidgets-ng/jqxrepeatbutton';
import { jqxProgressBarModule } from 'jqwidgets-ng/jqxprogressbar';
@Component({
    selector: 'app-root',
    imports: [jqxRepeatButtonModule, jqxProgressBarModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    @ViewChild('myProgressBar') myProgressBar: jqxRepeatButtonComponent

    repeatOnClick(): void {
        let currentValue = this.myProgressBar.value();
        currentValue += 1;
        this.myProgressBar.setOptions({ animationDuration: 0, value: currentValue });
    }
}
