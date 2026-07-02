import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('accounts')
export class Account {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({ unique: true })
    public accountId!: number;

    @Column()
    public subdomain!: string;

    @Column({ nullable: true, type: 'text' })
    public accessToken!: string | null;

    @Column({ nullable: true, type: 'text' })
    public refreshToken!: string | null;

    @Column({ default: false })
    public isInstalled!: boolean;
}
