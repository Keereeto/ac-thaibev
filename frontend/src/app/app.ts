import { ChangeDetectorRef, Component, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Directive, HostListener, ElementRef } from '@angular/core';

import { ProductsComponent } from "./components/products/products.component";
import { ProductService } from './services/product.service';

@Directive({
  selector: '[FormatProductIDInput]',
  standalone: true
})
export class FormatProductIDInputDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = this.el.nativeElement as HTMLInputElement;

    const start = input.selectionStart ?? 0;
    const originalValue = input.value;

    let value = originalValue.replace(/[^a-zA-Z0-9]/g, '');

    value = value.toUpperCase();

    const formattedValue = value.length > 5
      ? value.match(/.{1,5}/g)?.join('-') || value
      : value;

    if (input.value !== formattedValue) {
      input.value = formattedValue;

      const diff = formattedValue.length - originalValue.length;
      const newPos = start + diff;

      input.setSelectionRange(
        Math.min(newPos, formattedValue.length),
        Math.min(newPos, formattedValue.length)
      );
    }
  }
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductsComponent, FormatProductIDInputDirective],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  @ViewChild(ProductsComponent) productsComponent!: ProductsComponent;
  @ViewChild('productIdInput') productInput!: ElementRef<HTMLInputElement>;

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  addProduct(productId: string) {
    this.productService.addProduct(productId).subscribe({
      next: (returnProduct) => {
        this.productsComponent.getTotalProductCount();
        this.productsComponent.loadProducts();
        this.productInput.nativeElement.value = '';

        this.cdr.detectChanges();

        alert('New product is added!!');
      },
      error: (err) => {
        console.error(err);
        alert(err.error.detail);
      }
    });
  }
}
