import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm'

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true ,type: 'varchar', length: 255 })
  customer_code: string

  @OneToMany(() => Measurement, measurement => measurement.customer)
  measurements: Measurement[]
}

@Entity()
export class Measurement {
  @PrimaryGeneratedColumn()
  id: number

  @Column({unique: true, type: 'text'})
  uuid: string

  @Column({type: 'text'})
  image: string

  @Column({ type: 'timestamp' })
  datetime: Date

  @Column({ type: 'int' })
  value: number

  @Column({type: 'text'})
  type: string

  @Column({ type: 'boolean' })
  confirmed: boolean

  @ManyToOne(() => Customer, customer => customer.measurements)
  customer: Customer
}
