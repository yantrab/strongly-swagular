import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ceil } from 'lodash';
@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  @Input() status?: string;
  @Output() cancel = new EventEmitter();
  @Output() done = new EventEmitter();
  mouseover = false;

  constructor() {}

  _pst = 1;

  @Input() set pst(pst: number) {
    this._pst = Math.floor(pst);
  }

  @Input() get() {
    return this._pst;
  }

  ngOnInit(): void {}

  cancelAction() {
    this.cancel.emit();
  }

  hideProgressBar() {
    this.done.emit();
  }
}
