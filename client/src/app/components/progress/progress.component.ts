import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ceil } from 'lodash';
@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  @Input() pst = 1;
  @Input() status?: string;
  @Output() cancel = new EventEmitter();
  @Output() done = new EventEmitter();
  mouseover = false;
  constructor() {}

  ngOnInit(): void {}

  cancelAction() {
    this.cancel.emit();
  }

  hideProgressBar() {
    this.done.emit();
  }
}
