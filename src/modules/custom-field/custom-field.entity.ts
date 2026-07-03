import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Account } from '../account/account.entity';

@Entity('custom_fields')
@Unique(['fieldName', 'account'])
export class CustomField {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public fieldId!: number;

    @Column()
    public fieldName!: string;

    @Column()
    public fieldType!: string;

    @ManyToOne(() => Account)
    @JoinColumn()
    public account!: Account;
}
