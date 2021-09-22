import {
  Component,
  Input,
  OnInit
} from "@angular/core";

@Component({
    template: `Dummy component <br /> <pre>{{ data }}</pre>`
})
export class DummyComponent implements OnInit {
    @Input() data: any;

    ngOnInit(): void {
        console.log('DummyComponent');
    }
}
