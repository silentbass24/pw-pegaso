import { Component, ViewChild } from '@angular/core';

import { jqxPanelModule, jqxPanelComponent } from 'jqwidgets-ng/jqxpanel';
import { jqxButtonModule } from 'jqwidgets-ng/jqxbuttons';
import { jqxFileUploadModule, jqxFileUploadComponent } from 'jqwidgets-ng/jqxfileupload';

@Component({
    selector: 'app-root',
    imports: [jqxFileUploadModule, jqxPanelModule, jqxButtonModule],
    standalone: true,
    templateUrl: './app.component.html'
})


export class AppComponent {
    imageTypes: string[] = ['.gif', '.jpg', '.png'];

    videoTypes: string[] = ['.wmv', '.mov', '.avi', '.divx', '.mpeg', '.mpg', '.m4p'];

    renderFiles = (fileName: string): string => {
        let stopIndex = fileName.indexOf('.');
        let name = fileName.slice(0, stopIndex);
        let extension = fileName.slice(stopIndex);
        let iconUrl;
        if (this.imageTypes.indexOf(extension) !== -1) {
            iconUrl = 'assets/img/nav3.png';
        } else if (this.videoTypes.indexOf(extension) !== -1) {
            iconUrl = 'assets/img/movie.png';
        } else {
            iconUrl = 'assets/img/nav1.png';
        }
        return '<div><img src="' + iconUrl + '" style="dislplay: inline; width: 16px; height: 16px; margin-right: 5px;" /><span>' + name + '<strong>' + extension + '</strong></span></div>';
    };
}