﻿import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService, Alert } from './alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'fab-util-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit, OnDestroy {
  alert!: Alert;
  staticAlertClosed = false;
  subs!: Subscription;

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.subs = this.alertService.alert$.subscribe((alert) => {
      this.alert = alert;
      this.staticAlertClosed = false;
      // auto close alertbox after some time
      setTimeout(() => (this.staticAlertClosed = true), 4000);
    });
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
}
