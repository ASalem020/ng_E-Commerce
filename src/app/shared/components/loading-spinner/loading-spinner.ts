import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  imports: [CommonModule],
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.css'
})
export class LoadingSpinner implements OnInit, OnDestroy {
  @Input() type: 'default' | 'dots' | 'pulse' | 'bounce' | 'wave' | 'ring' | 'heart' = 'default';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' = 'primary';
  @Input() overlay: boolean = true;
  @Input() message: string = 'Loading...';
  @Input() showMessage: boolean = true;

  ngOnInit(): void {
    // Component initialization
  }
  
  ngOnDestroy(): void {
    // Cleanup if needed
  }

  getSizeClasses(): string {
    const sizeMap = {
      'sm': 'w-6 h-6',
      'md': 'w-12 h-12',
      'lg': 'w-16 h-16',
      'xl': 'w-20 h-20'
    };
    return sizeMap[this.size];
  }

  getColorClasses(): string {
    const colorMap = {
      'primary': 'text-green-500',
      'secondary': 'text-gray-500',
      'success': 'text-green-500',
      'warning': 'text-yellow-500',
      'danger': 'text-red-500',
      'info': 'text-blue-500'
    };
    return colorMap[this.color];
  }
}