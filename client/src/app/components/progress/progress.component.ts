import { Component, Input, OnInit } from '@angular/core';
import { ceil } from 'lodash';
@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  @Input() initialCount?: number;
  @Input() doneCount?: number;
  @Input() status?: number;

  constructor() {}

  get width() {
    return ceil(this.doneCount! / this.initialCount!, 2) * 100;
  }

  ngOnInit(): void {}
}
