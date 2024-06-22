import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  title: string;

  @Column()
  description: string;

  @Column({ type: "bigint" })
  createdAt = Date.now();

  @Column({ nullable: true })
  dueDate: number;

  @Column({ nullable: true })
  isPinned: boolean = false;

  @Column()
  isComplete: boolean = false;
}
