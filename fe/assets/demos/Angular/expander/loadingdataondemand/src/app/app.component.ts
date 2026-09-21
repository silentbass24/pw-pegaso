import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { jqxExpanderModule, jqxExpanderComponent } from 'jqwidgets-ng/jqxexpander';
@Component({
    selector: 'app-root',
    imports: [jqxExpanderModule],
    standalone: true,
    templateUrl: './app.component.html'
})


export class AppComponent implements AfterViewInit {
    @ViewChild('myExpander') myExpander: jqxExpanderComponent;

    constructor(private http: HttpClient) { }

    ngAfterViewInit(): void {
        this.http.get('../assets/jqxexpanderxmldata.txt', { responseType: 'text' })
            .subscribe(data => this.populateExpader(data));
    }

    populateExpader(data: string) {
        let content = document.createElement('div');
        content.innerHTML = data;

        let LIArray = content.getElementsByTagName('li');
        let container = document.createElement('div');
        let ul = document.createElement('ul');

        for (let i = 0; i < LIArray.length; i++) {
            let li = document.createElement('li');
            li.innerText = LIArray[i].innerHTML;
            ul.appendChild(li)
        }

        container.appendChild(ul);

        this.myExpander.setContent(container.outerHTML);
        this.myExpander.setHeaderContent(content.getElementsByTagName('header')[0].innerHTML);
    }
}