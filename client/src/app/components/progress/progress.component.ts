import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  @Output() cancel = new EventEmitter();
  @Output() done = new EventEmitter();
  mouseover = false;
  @Input() status?: string;

  constructor() {}

  get _status() {
    return this._pst === 100 ? 'done' : this.status;
  }

  _pst = 1;

  get pst() {
    return this._pst;
  }

  @Input() set pst(pst: number) {
    this._pst = Math.floor(pst);
  }

  ngOnInit(): void {}

  cancelAction() {
    this.cancel.emit();
  }

  hideProgressBar() {
    this.done.emit();
  }
}
