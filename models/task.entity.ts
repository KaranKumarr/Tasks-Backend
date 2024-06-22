import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  private _user: User;

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
