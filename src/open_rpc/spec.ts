// deno-lint-ignore-file no-explicit-any

/**
 * The OpenRPC Specification defines a standard, programming language-agnostic interface description for JSON-RPC 2.0 APIs.
 * This file contains annotated TypeScript types based on the OpenRPC meta-schema and the specification document.
 */


/**
 * Supported OpenRPC versions as per the specification.
*/
export type OpenRpcVersion = "1.3.2" | "1.3.1" | "1.3.0" | "1.2.6" | "1.2.5" | "1.2.4" | "1.2.3" | "1.2.2" | "1.2.1" | "1.2.0" | "1.1.12" | "1.1.11" | "1.1.10" | "1.1.9" | "1.1.8" | "1.1.7" | "1.1.6" | "1.1.5" | "1.1.4" | "1.1.3" | "1.1.2" | "1.1.1" | "1.1.0" | "1.0.0" | "1.0.0-rc1" | "1.0.0-rc0";

/**
 * The title of the application.
 */
export type InfoObjectProperties = string;

/**
 * A verbose description of the application. GitHub Flavored Markdown syntax MAY be used for rich text representation.
 */
export type InfoObjectDescription = string;

/**
 * A URL to the Terms of Service for the API. MUST be in the format of a URL.
 */
export type InfoObjectTermsOfService = string;

/**
 * The version of the OpenRPC document (which is distinct from the OpenRPC Specification version or the API implementation version).
 */
export type InfoObjectVersion = string;

/**
 * The identifying name of the contact person/organization.
 */
export type ContactObjectName = string;

/**
 * The email address of the contact person/organization. MUST be in the format of an email address.
 */
export type ContactObjectEmail = string;

/**
 * The URL pointing to the contact information. MUST be in the format of a URL.
 */
export type ContactObjectUrl = string;

/**
 * Specification extensions allow for additional fields prefixed with 'x-'.
 */
export type SpecificationExtension = any;

/**
 * Contact information for the exposed API.
 */
export interface ContactObject {
  /**
   * The identifying name of the contact person/organization.
   */
  name? : ContactObjectName,
  /**
   * The email address of the contact person/organization. MUST be in the format of an email address.
   */
  email? : ContactObjectEmail,
  /**
   * The URL pointing to the contact information. MUST be in the format of a URL.
   */
  url? : ContactObjectUrl,
  [regex : string] : SpecificationExtension | any
}

/**
 * The license name used for the API.
 */
export type LicenseObjectName = string;

/**
 * A URL to the license used for the API. MUST be in the format of a URL.
 */
export type LicenseObjectUrl = string;

/**
 * License information for the exposed API.
 */
export interface LicenseObject {
  /**
   * The license name used for the API.
   */
  name? : LicenseObjectName,
  /**
   * A URL to the license used for the API. MUST be in the format of a URL.
   */
  url? : LicenseObjectUrl,
  [regex : string] : SpecificationExtension | any
}

/**
 * Provides metadata about the API. The metadata MAY be used by tooling as required.
 */
export interface InfoObject {
  /**
   * The title of the application.
   */
  title : InfoObjectProperties,
  /**
   * A verbose description of the application. GitHub Flavored Markdown syntax MAY be used for rich text representation.
   */
  description? : InfoObjectDescription,
  /**
   * A URL to the Terms of Service for the API. MUST be in the format of a URL.
   */
  termsOfService? : InfoObjectTermsOfService,
  /**
   * The version of the OpenRPC document (which is distinct from the OpenRPC Specification version or the API implementation version).
   */
  version : InfoObjectVersion,
  /**
   * The contact information for the exposed API.
   */
  contact? : ContactObject,
  /**
   * The license information for the exposed API.
   */
  license? : LicenseObject,
  [regex : string] : SpecificationExtension | any
}

/**
 * An optional string describing the host designated by the URL. GitHub Flavored Markdown syntax MAY be used for rich text representation.
 */
export type ExternalDocumentationObjectDescription = string;

/**
 * The URL for the target documentation. Value MUST be in the format of a URL.
 */
export type ExternalDocumentationObjectUrl = string;

/**
 * Information about external documentation.
 */
export interface ExternalDocumentationObject {
  /**
   * A description of the target documentation. GitHub Flavored Markdown syntax MAY be used for rich text representation.
   */
  description? : ExternalDocumentationObjectDescription,
  /**
   * The URL for the target documentation. Value MUST be in the format of a URL.
   */
  url : ExternalDocumentationObjectUrl,
  [regex : string] : SpecificationExtension | any
}

/**
 * A URL to the target host. This URL supports Server Variables and MAY be relative, to indicate that the host location is relative to the location where the OpenRPC document is being served.
 */
export type ServerObjectUrl = string;

/**
 * A name to be used as the canonical name for the server.
 */
export type ServerObjectName = string;

/**
 * An optional string describing the host designated by the URL. GitHub Flavored Markdown syntax MAY be used for rich text representation.
 */
export type ServerObjectDescription = string;

/**
 * A short summary of what the server is.
 */
export type ServerObjectSummary = string;

/**
 * The default value to use for substitution, which SHALL be sent if an alternate value is not supplied.
 */
export type ServerObjectVariableDefault = string;

/**
 * An optional description for the server variable. GitHub Flavored Markdown syntax MAY be used for rich text representation.
 */
export type ServerObjectVariableDescription = string;

/**
 * An enumeration of string values to be used if the substitution options are from a limited set.
 */
export type ServerObjectVariableEnumItem = string;

/**
 * An enumeration of string values to be used if the substitution options are from a limited set.
 */
export type ServerObjectVariableEnum = ServerObjectVariableEnumItem[];

/**
 * An object representing a Server Variable for server URL template substitution.
 */
export interface ServerObjectVariable {
  /**
   * The default value to use for substitution, which SHALL be sent if an alternate value is not supplied.
   */
  default : ServerObjectVariableDefault,
  /**
   * An optional description for the server variable. GitHub Flavored Markdown syntax MAY be used for rich text representation.
   */
  description? : ServerObjectVariableDescription,
  /**
   * An enumeration of string values to be used if the substitution options are from a limited set.
   */
  enum? : ServerObjectVariableEnum,
  [k : string] : any
}

/**
 * A map between a variable name and its value. The value is passed into the Runtime Expression to produce a server URL.
 */
export interface ServerObjectVariables { [key : string] : any }

/**
 * An object representing a Server.
 */
export interface ServerObject {
  /**
   * A URL to the target host. This URL supports Server Variables and MAY be relative.
   */
  url : ServerObjectUrl,
  /**
   * A name to be used as the canonical name for the server.
   */
  name? : ServerObjectName,
  /**
   * An optional string describing the host designated by the URL.
   */
  description? : ServerObjectDescription,
  /**
   * A short summary of what the server is.
   */
  summary? : ServerObjectSummary,
  /**
   * A map between a variable name and its value.
   */
  variables? : ServerObjectVariables,
  [regex : string] : SpecificationExtension | any
}

/**
 * Placeholder for always false schema (used in JSON Schema definitions).
 */
// type AlwaysFalse = any;

/**
 * An array of Server Objects, which provide connectivity information to a target server.
 */
export type Servers = ServerObject[];

/**
 * The canonical name for the method. The name MUST be unique within the methods array.
 */
export type MethodObjectName = string;

/**
 * A verbose explanation of the method behavior. GitHub Flavored Markdown syntax MAY be used for rich text representation.
 */
export type MethodObjectDescription = string;

/**
 * A short summary of what the method does.
 */
export type MethodObjectSummary = string;

/**
 * The name of the tag.
 */
export type TagObjectName = string;

/**
 * A short description for the tag. GitHub Flavored Markdown syntax MAY be used for rich text representation.
 */
export type TagObjectDescription = string;

/**
 * A Tag object for logical grouping.
 */
export interface TagObject {
  /**
   * The name of the tag.
   */
  name : TagObjectName,
  /**
   * A short description for the tag.
   */
  description? : TagObjectDescription,
  /**
   * Additional external documentation for this tag.
   */
  externalDocs? : ExternalDocumentationObject,
  [regex : string] : SpecificationExtension | any
}

/**
 * A reference to a component via $ref.
 */
export type $Ref = string;

/**
 * Allows referencing an external resource for extended documentation.
 */
export interface ReferenceObject {
  /**
   * The reference string.
   */
  $ref : $Ref
}

/**
 * A Tag or a reference to one.
 */
export type TagOrReference = TagObject | ReferenceObject;

/**
 * A list of tags for API documentation control.
 */
export type MethodObjectTags = TagOrReference[];

/**
 * Format the server expects the params.
 */
export type MethodObjectParamStructure = "by-position" | "by-name" | "either";

/**
 * The name of the content descriptor.
 */
export type ContentDescriptorObjectName = string;

/**
 * A verbose explanation of the content descriptor.
 */
export type ContentDescriptorObjectDescription = string;

/**
 * A short summary of the content descriptor.
 */
export type ContentDescriptorObjectSummary = string;

/**
 * Indicates if this parameter is required.
 */
export type ContentDescriptorObjectRequired = boolean;

/**
 * Specifies the schema for this content descriptor.
 */
export type ContentDescriptorObjectSchema = any;

/**
 * Indicates if this content descriptor is deprecated.
 */
export type ContentDescriptorObjectDeprecated = boolean;

/**
 * Describes a parameter or result.
 */
export interface ContentDescriptorObject {
  /**
   * The name of the content descriptor.
   */
  name : ContentDescriptorObjectName,
  /**
   * A verbose explanation of the content descriptor.
   */
  description? : ContentDescriptorObjectDescription,
  /**
   * A short summary of the content descriptor.
   */
  summary? : ContentDescriptorObjectSummary,
  /**
   * Indicates if this parameter is required.
   */
  required? : ContentDescriptorObjectRequired,
  /**
   * Specifies the schema for this content descriptor.
   */
  schema : ContentDescriptorObjectSchema,
  /**
   * Indicates if this content descriptor is deprecated.
   */
  deprecated? : ContentDescriptorObjectDeprecated,
  [regex : string] : SpecificationExtension | any
}

/**
 * Content Descriptor or Reference.
 */
export type ContentDescriptorOrReference = ContentDescriptorObject | ReferenceObject;

/**
 * A list of parameters that are applicable for this method.
 */
export type MethodObjectParams = ContentDescriptorOrReference[];

/**
 * The expected result descriptor.
 */
export type MethodObjectResult = ContentDescriptorOrReference;

/**
 * A Number that indicates the error type that occurred.
 */
export type ErrorObjectCode = number;

/**
 * A String providing a short description of the error.
 */
export type ErrorObjectMessage = string;

/**
 * A Primitive or Structured value that contains additional information about the error.
 */
export type ErrorObjectData = any;

/**
 * Defines an application level error.
 */
export interface ErrorObject {
  /**
   * A Number that indicates the error type that occurred.
   */
  code : ErrorObjectCode,
  /**
   * A String providing a short description of the error.
   */
  message : ErrorObjectMessage,
  /**
   * A Primitive or Structured value that contains additional information about the error.
   */
  data? : ErrorObjectData,
  [regex : string] : SpecificationExtension | any
}

/**
 * Error or Reference.
 */
export type ErrorOrReference = ErrorObject | ReferenceObject;

/**
 * A list of possible error responses.
 */
export type MethodObjectErrors = ErrorOrReference[];

/**
 * The name or URI of the method to be called.
 */
export type LinkObjectMethod = string;

/**
 * A description of the link.
 */
export type LinkObjectDescription = string;

/**
 * A map of parameters to be passed to the linked method.
 */
export type LinkObjectParams = any;

/**
 * A server object to be used by the linked method.
 */
export type LinkObjectServer = ServerObject;

/**
 * A link from a method call response to another method call.
 */
export interface LinkObject {
  /**
   * The name of the link.
   */
  name? : string,
  /**
   * A method to be called when the link is invoked.
   */
  method? : LinkObjectMethod,
  /**
   * A description of the link.
   */
  description? : LinkObjectDescription,
  /**
   * A map of parameters to be passed to the linked method.
   */
  params? : LinkObjectParams,
  /**
   * A server object to be used by the linked method.
   */
  server? : LinkObjectServer,
  [regex : string] : SpecificationExtension | any
}

/**
 * Link or Reference.
 */
export type LinkOrReference = LinkObject | ReferenceObject;

/**
 * A list of possible links from this method call.
 */
export type MethodObjectLinks = LinkOrReference[];

/**
 * The name of the example pairing.
 */
export type ExamplePairingObjectName = string;

/**
 * A verbose explanation of the example pairing.
 */
export type ExamplePairingObjectDescription = string;

/**
 * Short description for the example.
 */
export type ExampleObjectSummary = string;

/**
 * Embedded literal example. The value field and externalValue field are mutually exclusive.
 */
export type ExampleObjectValue = any;

/**
 * A verbose explanation of the example.
 */
export type ExampleObjectDescription = string;

/**
 * The name of the example.
 */
export type ExampleObjectName = string;

/**
 * Represents a possible design-time example for a request or response.
 */
export interface ExampleObject {
  /**
   * Short description for the example.
   */
  summary? : ExampleObjectSummary,
  /**
   * Embedded literal example.
   */
  value : ExampleObjectValue,
  /**
   * A verbose explanation of the example.
   */
  description? : ExampleObjectDescription,
  /**
   * The name of the example.
   */
  name : ExampleObjectName,
  [regex : string] : SpecificationExtension | any
}

/**
 * Example or Reference.
 */
export type ExampleOrReference = ExampleObject | ReferenceObject;

/**
 * A list of examples for params.
 */
export type ExamplePairingObjectParams = ExampleOrReference[];

/**
 * An example for the result.
 */
export type ExamplePairingObjectResult = ExampleObject | ReferenceObject;

/**
 * Pairs a set of examples for params with an example for a result.
 */
export interface ExamplePairingObject {
  /**
   * The name of the example pairing.
   */
  name : ExamplePairingObjectName,
  /**
   * A verbose explanation of the example pairing.
   */
  description? : ExamplePairingObjectDescription,
  /**
   * A list of examples for params.
   */
  params : ExamplePairingObjectParams,
  /**
   * An example for the result.
   */
  result? : ExamplePairingObjectResult,
  [k : string] : any
}

/**
 * Example Pairing or Reference.
 */
export type ExamplePairingOrReference = ExamplePairingObject | ReferenceObject;

/**
 * A list of examples of the usage of this method.
 */
export type MethodObjectExamples = ExamplePairingOrReference[];

/**
 * Declares the method as deprecated. Defaults to false.
 */
export type MethodObjectDeprecated = boolean;

/**
 * Describes the interface for the given method name.
 */
export interface MethodObject {
  /**
   * The canonical name for the method.
   */
  name : MethodObjectName,
  /**
   * A verbose explanation of the method behavior.
   */
  description? : MethodObjectDescription,
  /**
   * A short summary of what the method does.
   */
  summary? : MethodObjectSummary,
  /**
   * An alternative server array to service this method.
   */
  servers? : Servers,
  /**
   * A list of tags for API documentation control.
   */
  tags? : MethodObjectTags,
  /**
   * Format the server expects the params. Defaults to 'either'.
   * @default either
   */
  paramStructure? : MethodObjectParamStructure,
  /**
   * A list of parameters that are applicable for this method.
   */
  params : MethodObjectParams,
  /**
   * The expected result descriptor.
   */
  result? : MethodObjectResult,
  /**
   * A list of possible error responses.
   */
  errors? : MethodObjectErrors,
  /**
   * A list of possible links from this method call.
   */
  links? : MethodObjectLinks,
  /**
   * A list of examples of the usage of this method.
   */
  examples? : MethodObjectExamples,
  /**
   * Declares the method as deprecated. Defaults to false.
   */
  deprecated? : MethodObjectDeprecated,
  /**
   * Additional external documentation for this method.
   */
  externalDocs? : ExternalDocumentationObject,
  [regex : string] : SpecificationExtension | any
}

/**
 * Method or Reference.
 */
export type MethodOrReference = MethodObject | ReferenceObject;

/**
 * The available methods for the API.
 */
export type Methods = MethodOrReference[];

/**
 * Holds a set of reusable Schema Objects.
 */
export interface SchemaComponents { [key : string] : any }

/**
 * Holds a set of reusable Link Objects.
 */
export interface LinkComponents { [key : string] : any }

/**
 * Holds a set of reusable Error Objects.
 */
export interface ErrorComponents { [key : string] : any }

/**
 * Holds a set of reusable Example Objects.
 */
export interface ExampleComponents { [key : string] : any }

/**
 * Holds a set of reusable Example Pairing Objects.
 */
export interface ExamplePairingComponents { [key : string] : any }

/**
 * Holds a set of reusable Content Descriptor Objects.
 */
export interface ContentDescriptorComponents { [key : string] : any }

/**
 * Holds a set of reusable Tag Objects.
 */
export interface TagComponents { [key : string] : any }

/**
 * An element to hold various schemas for the specification.
 */
export interface Components {
  /**
   * An object to hold reusable Schema Objects.
   */
  schemas? : SchemaComponents,
  /**
   * An object to hold reusable Link Objects.
   */
  links? : LinkComponents,
  /**
   * An object to hold reusable Error Objects.
   */
  errors? : ErrorComponents,
  /**
   * An object to hold reusable Example Objects.
   */
  examples? : ExampleComponents,
  /**
   * An object to hold reusable Example Pairing Objects.
   */
  examplePairings? : ExamplePairingComponents,
  /**
   * An object to hold reusable Content Descriptor Objects.
   */
  contentDescriptors? : ContentDescriptorComponents,
  /**
   * An object to hold reusable Tag Objects.
   */
  tags? : TagComponents,
  [k : string] : any
}

/**
 * JSON Schema URI (used by some editors). Defaults to https://meta.open-rpc.org/.
 * @default https://meta.open-rpc.org/
 */
export type MetaSchema = string;

/**
 * The root object of the OpenRPC document.
 */
export interface OpenRpcDocument {
  /**
   * Specifies the OpenRPC Specification version being used.
   */
  openrpc : OpenRpcVersion,
  /**
   * Provides metadata about the API.
   */
  info : InfoObject,
  /**
   * Additional external documentation.
   */
  externalDocs? : ExternalDocumentationObject,
  /**
   * An array of Server Objects.
   */
  servers? : Servers,
  /**
   * The available methods for the API.
   */
  methods : Methods,
  /**
   * An element to hold various schemas for the specification.
   */
  components? : Components,
  /**
   * JSON Schema URI.
   */
  $schema? : MetaSchema,
  [regex : string] : SpecificationExtension | any
}
