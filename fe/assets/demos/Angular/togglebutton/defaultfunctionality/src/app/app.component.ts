import { Component, ViewChild } from '@angular/core';


import { jqxToggleButtonModule, jqxToggleButtonComponent } from 'jqwidgets-ng/jqxtogglebutton';
@Component({
    selector: 'app-root',
    imports: [jqxToggleButtonModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    @ViewChild('myToggleButton') myToggleButton: jqxToggleButtonComponent;

    myToggleButtonClick(): void {
        setTimeout(_ => {
            let toggled = this.myToggleButton.toggled();

            if (toggled) {
                this.myToggleButton.val('Toggled On');
            }
            else {
                this.myToggleButton.val('Toggled Off');
            }
        });
    };
}
