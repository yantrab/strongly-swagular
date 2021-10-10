import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ceil } from 'lodash';
@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  @Input() initialCount?: number;
  @Input() doneCount?: number;
  @Input() status?: string;
  @Output() cancel = new EventEmitter();
  @Output() done = new EventEmitter();
  pst = 1;
  mouseover = false;
  constructor() {}

  ngOnInit(): void {
    const gap = 100 / this.initialCount! - 5;
    setInterval(() => {
      const p = ceil(this.doneCount! / this.initialCount!, 2) * 100 || 1;
      if (this.pst < p + gap) this.pst++;
      if (this.pst < p) this.pst = p;
      if (this.pst > 100) this.pst = 100;
    }, 100);
  }

  cancelAction() {
    this.cancel.emit();
  }

  hideProgressBar() {
    this.done.emit();
  }
}
