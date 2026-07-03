import { Component, ElementRef, forwardRef, Output, ViewChild } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

import { QRCodeComponent } from 'angularx-qrcode';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'products',
  imports: [forwardRef(() => FormatProductIDPipe), QRCodeComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  @ViewChild('qrDialog') qrDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('confirmDeleteDialog') deleteDialog!: ElementRef<HTMLDialogElement>;

  totalProducts: number = 0;
  totalPages: number = 0;
  currentPage: number = 0;

  products: Product[] = [];

  showQRData: string | null = null;
  productToDelete: string | null = null;

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getTotalProductCount();

    this.currentPage = 1;
    this.loadProducts();
  }

  public getTotalProductCount() {
    this.productService.getTotal().subscribe({
      next: (returnCount) => {
        this.totalProducts = returnCount.total;
        this.totalPages = Math.ceil(this.totalProducts / 10);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        alert(err.error.detail);
      }
    });
  }

  public loadProducts(loadAfterRemoved: boolean = false) {
    this.productService.getProducts(this.currentPage).subscribe({
      next: (returnProducts) => {
        this.products = returnProducts;

        if(loadAfterRemoved) {
          this.getTotalProductCount();

          if(this.products.length == 0 && this.currentPage > 1) {
            this.currentPage--;
            this.loadProducts();
          }
        } else {
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error(err);
        alert(err.error.detail);
      }
    });
  }

  gotoPage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.loadProducts();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;

      this.loadProducts();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;

      this.loadProducts();
    }
  }

  showQR(productID: string) {
    this.showQRData = productID;
    this.qrDialog.nativeElement.showModal();
  }

  closeQRDialog() {
    this.qrDialog.nativeElement.close();
  }

  onQRDialogClose(event: Event) {
    this.showQRData = null;
  }

  showDeleteDialog(productID: string) {
    this.productToDelete = productID;
    this.deleteDialog.nativeElement.showModal();
  }

  confirmDelete() {
    this.productService.removeProduct(this.productToDelete!).subscribe({
      next: () => {
        this.loadProducts(true);

        this.closeDeleteDialog();

        alert('The product is deleted!!');
      },
      error: (err) => {
        console.error(err);
        alert(err.error.detail);
      }
    });
  }

  closeDeleteDialog() {
    this.deleteDialog.nativeElement.close();
  }

  onDeleteDialogClose(event: Event) {
    this.productToDelete = null;
  }
}

@Pipe({ name: 'FormatProductID' })
export class FormatProductIDPipe implements PipeTransform {
  transform(value: string | undefined): string {
    if (!value) return '';

    const chunks = value.match(/.{1,5}/g);
    return chunks ? chunks.join('-') : value;
  }
}
