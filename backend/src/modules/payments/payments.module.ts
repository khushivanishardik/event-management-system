// Location: backend/src/modules/payments/payments.module.ts
// Purpose: Wires PaymentsService with TicketsModule and EmailService.

import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { TicketsModule } from '../tickets/tickets.module';
import { EmailService } from '../../common/services/email.service';

@Module({
  imports: [TicketsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, EmailService],
})
export class PaymentsModule {}