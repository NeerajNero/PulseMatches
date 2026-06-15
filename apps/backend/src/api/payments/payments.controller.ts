import { Body, Controller, Get, Headers, Param, Post, RawBodyRequest, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RoleType } from "@prisma/client";
import { Request } from "express";
import { RateLimit } from "../../common/rate-limit/rate-limit.decorator";
import { AuthenticatedUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import {
  MockCompletePaymentRequestDto,
  MockWebhookPaymentRequestDto,
  PaymentIntentApiResponseDto,
  RegistrationPaymentDetailApiResponseDto,
  VerifyRazorpayPaymentRequestDto
} from "./dto/payment.dto";
import { PaymentsService } from "./payments.service";

@ApiTags("payments")
@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("me/registrations/:registrationId/payment-intent")
  @RateLimit({ bucket: "payment" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.PLAYER)
  @ApiOperation({ summary: "Create or return an online payment intent for the current player's registration" })
  @ApiCreatedResponse({ type: PaymentIntentApiResponseDto })
  createPaymentIntent(
    @Param("registrationId") registrationId: string,
    @CurrentUser() currentUser: AuthenticatedUser
  ) {
    return this.paymentsService.createPaymentIntent(registrationId, currentUser);
  }

  @Get("me/registrations/:registrationId/payment")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.PLAYER)
  @ApiOperation({ summary: "Get a safe current-player registration payment summary" })
  @ApiOkResponse({ type: RegistrationPaymentDetailApiResponseDto })
  findRegistrationPayment(
    @Param("registrationId") registrationId: string,
    @CurrentUser() currentUser: AuthenticatedUser
  ) {
    return this.paymentsService.findRegistrationPayment(registrationId, currentUser);
  }

  @Post("payments/mock/complete")
  @RateLimit({ bucket: "payment" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.PLAYER)
  @ApiOperation({ summary: "Complete a mock payment intent for the current player in non-production environments" })
  @ApiOkResponse({ type: PaymentIntentApiResponseDto })
  completeMockPayment(
    @Body() dto: MockCompletePaymentRequestDto,
    @CurrentUser() currentUser: AuthenticatedUser
  ) {
    return this.paymentsService.completeMockPayment(dto, currentUser);
  }

  @Post("me/registrations/:registrationId/payment/verify")
  @RateLimit({ bucket: "payment" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.PLAYER)
  @ApiOperation({ summary: "Verify Razorpay Checkout payment success for the current player's registration" })
  @ApiOkResponse({ type: PaymentIntentApiResponseDto })
  verifyRazorpayPayment(
    @Param("registrationId") registrationId: string,
    @Body() dto: VerifyRazorpayPaymentRequestDto,
    @CurrentUser() currentUser: AuthenticatedUser
  ) {
    return this.paymentsService.verifyRazorpayPayment(registrationId, dto, currentUser);
  }

  @Post("payments/webhooks/:provider")
  @RateLimit({ bucket: "payment" })
  @ApiOperation({ summary: "Provider-neutral payment webhook endpoint" })
  @ApiHeader({ name: "x-razorpay-signature", required: false })
  @ApiHeader({ name: "x-razorpay-event-id", required: false })
  @ApiOkResponse({ type: PaymentIntentApiResponseDto })
  handleWebhook(
    @Param("provider") provider: string,
    @Body() dto: MockWebhookPaymentRequestDto | Record<string, unknown>,
    @Req() request: RawBodyRequest<Request>,
    @Headers("x-razorpay-signature") razorpaySignature?: string,
    @Headers("x-razorpay-event-id") razorpayEventId?: string
  ) {
    return this.paymentsService.handleWebhook(provider, dto, {
      rawBody: request.rawBody,
      razorpaySignature,
      razorpayEventId
    });
  }
}
