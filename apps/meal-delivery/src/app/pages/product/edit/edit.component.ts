import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../product.model';
import { ProductService } from '../product.service';

export enum AllergyTypesEnum {
  gerst = 'gerst',
  gluten = 'gluten',
  mais = 'mais',
  peulvruchten = 'peulvruchten',
  soja = 'soja',
  tarwe = 'tarwe',
  wortel = 'wortel',
}

@Component({
  selector: 'user-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  componentId: string | null | undefined;
  componentExists: boolean = false;
  product: Product | undefined;
  productName: string | undefined;
  public allergyTypes = Object.values(AllergyTypesEnum);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.componentId = params.get('id');
      if (this.componentId) {
        console.log('Bestaande component');
        this.componentExists = true;
        this.product = {
          ...this.productService.getProductById(this.componentId),
        };
        this.productName = this.product.name;
      } else {
        console.log('Nieuwe component');
        this.componentExists = false;
        this.product = {
          id: undefined,
          name: '',
          allergies: [],
          containsAlcohol: false,
        };
      }
    });
  }

  addAllergy() {
    this.product!.allergies!.push('');
  }

  onSubmit() {
    console.log('Submitting the form');
    if (this.componentExists) {
      const noEmptyStringAllergies = this.product?.allergies!.filter(
        (allergy) => {
          return allergy !== '';
        }
      );
      this.product!.allergies = noEmptyStringAllergies;
      this.productService.updateProduct(this.product!);
      this.router.navigate(['product']);
    } else {
      this.product!.id = this.uuid();
      const noEmptyStringAllergies = this.product?.allergies!.filter(
        (allergy) => {
          return allergy !== '';
        }
      );
      this.product!.allergies = noEmptyStringAllergies;
      this.productService.addProduct(this.product!);
      this.router.navigate(['product']);
    }
  }

  uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}