import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Trademark {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({ nullable: true })
  title: string;
}
