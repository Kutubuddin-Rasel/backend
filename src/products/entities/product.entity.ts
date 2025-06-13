import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { VendorProfile } from '../../vendors/entities/vendor-profile.entity';
import { Specification } from './specification.entity';
import { Tag } from './tag.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  vendorId: string;
  @ManyToOne(() => VendorProfile)
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorProfile;

  @Column()
  name: string;
  @Column('text') description: string;
  @Column('numeric') price: number;
  @Column() sku: string;
  @Column('int') stock: number;
  @Column('int') threshold: number;
  @Column({ nullable: true }) primaryImage: string;

  @OneToMany(() => Specification, (spec) => spec.product, { cascade: true })
  specifications: Specification[];

  @ManyToMany(() => Tag, { cascade: true })
  @JoinTable({
    name: 'product_tags',
    joinColumn: { name: 'productId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' }
  })
  tags: Tag[];

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}