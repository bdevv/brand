import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class History {
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

  @Column({ nullable: true, default: "ONLINE" })
  status: string;
}
