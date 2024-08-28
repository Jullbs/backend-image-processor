import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm'

@Entity()
export class Reading {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255 })
  customer_code: string

  @Column('text')
  image: string

  @Column({ type: 'timestamp' })
  measure_datetime: Date

  @Column({ type: 'int' })
  measure_type: number

  @Column({ type: 'boolean' })
  confirmed: boolean

  @ManyToOne(() => Customer, customer => customer.readings)
  customer: Customer
}

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255 })
  customer_code: string

  @OneToMany(() => Reading, reading => reading.customer)
  readings: Reading[]
}
