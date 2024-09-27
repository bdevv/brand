import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Data {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, default: "" })
  url: string;

  @Column()
  title: string;

  @Column({ nullable: true, default: "" })
  views: string;

  @Column({ type:"numeric", nullable: true, default: 0 })
  num_views: number;

  @Column({ nullable: true, default: "" })
  status: string;

  @Column({ nullable: true, default: "" })
  taskId: string;
}
